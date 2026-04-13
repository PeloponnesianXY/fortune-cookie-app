const http = require('http');
const { URL } = require('url');

const {
  CANONICAL_BUCKET_KEYS,
  readRegistry,
  toUiFortune,
  writeRegistry,
  normalizeStorageBucketKey,
} = require('./fortuneRegistryStore');

const PORT = Number(process.env.FORTUNE_LAB_PORT || 4312);
const HOST = process.env.FORTUNE_LAB_HOST || '127.0.0.1';
const FIRST_USER_BUCKET_COUNT = 12;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

function getUiBucketOrder() {
  return [
    ...CANONICAL_BUCKET_KEYS.slice(0, FIRST_USER_BUCKET_COUNT),
    ...CANONICAL_BUCKET_KEYS.slice(FIRST_USER_BUCKET_COUNT),
  ];
}

function getSelectedBuckets(fortune) {
  return [
    fortune.primaryBucket,
    ...(fortune.alsoFits || []),
  ];
}

function toApiFortune(fortune) {
  const uiFortune = toUiFortune(fortune);
  const buckets = getSelectedBuckets(uiFortune);

  return {
    ...uiFortune,
    buckets,
    scope: buckets.length > 1 ? 'shared' : 'specific',
  };
}

function normalizeSelectedBuckets(selectedBuckets, currentPrimaryBucket) {
  const seen = new Set();
  const normalized = selectedBuckets
    .map((bucket) => normalizeStorageBucketKey(bucket))
    .filter((bucket) => {
      if (!CANONICAL_BUCKET_KEYS.includes(bucket === 'weird' ? 'unknown' : bucket)) {
        return false;
      }

      if (seen.has(bucket)) {
        return false;
      }

      seen.add(bucket);
      return true;
    });

  if (normalized.length === 0) {
    return null;
  }

  const existingPrimary = normalizeStorageBucketKey(currentPrimaryBucket);
  const primaryBucket = normalized.includes(existingPrimary)
    ? existingPrimary
    : normalized[0];
  const alsoFits = normalized.filter((bucket) => bucket !== primaryBucket);

  return {
    primaryBucket,
    alsoFits,
    scope: alsoFits.length > 0 ? 'shared' : 'specific',
  };
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = '';

    request.on('data', (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 1024 * 1024) {
        reject(new Error('Request body too large.'));
      }
    });

    request.on('end', () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });

    request.on('error', reject);
  });
}

function createNextFortuneId(fortunes) {
  let highestNumber = 0;

  for (const fortune of fortunes) {
    const match = /^f_(\d+)$/.exec(fortune.id || '');
    if (!match) {
      continue;
    }

    highestNumber = Math.max(highestNumber, Number(match[1] || 0));
  }

  return `f_${String(highestNumber + 1).padStart(4, '0')}`;
}

function listResponsePayload() {
  const registry = readRegistry();
  return buildListResponsePayload(registry);
}

function buildListResponsePayload(registry) {
  const fortunes = registry.fortunes
    .filter((fortune) => fortune.active !== false)
    .map((fortune) => toApiFortune(fortune));

  return {
    fortunes,
    bucketOrder: getUiBucketOrder(),
    userFacingBucketCount: FIRST_USER_BUCKET_COUNT,
    storageBucketOrder: registry.bucketKeys,
  };
}

function buildProcessIssue(id, error, kind) {
  return { id, error, kind };
}

function processBatchChanges(body) {
  const registry = readRegistry();
  const nextFortunes = [...registry.fortunes];
  const issues = [];
  let didChange = false;

  const deletions = Array.isArray(body.deletions) ? body.deletions : [];
  const creations = Array.isArray(body.creations) ? body.creations : [];
  const updates = Array.isArray(body.updates) ? body.updates : [];

  for (const fortuneId of deletions) {
    const fortuneIndex = nextFortunes.findIndex((fortune) => fortune.id === fortuneId);
    if (fortuneIndex === -1 || nextFortunes[fortuneIndex].active === false) {
      continue;
    }

    nextFortunes[fortuneIndex] = {
      ...nextFortunes[fortuneIndex],
      active: false,
      alsoFits: [],
      scope: 'specific',
    };
    didChange = true;
  }

  for (const draftFortune of creations) {
    const nextText = typeof draftFortune?.text === 'string' ? draftFortune.text.trim() : '';
    if (!nextText) {
      issues.push(buildProcessIssue(draftFortune?.id, 'Fortune text cannot be empty.', 'create'));
      continue;
    }

    const bucketUpdate = normalizeSelectedBuckets(
      Array.isArray(draftFortune?.buckets) ? draftFortune.buckets : [],
      Array.isArray(draftFortune?.buckets) ? draftFortune.buckets[0] : null
    );

    if (!bucketUpdate) {
      issues.push(buildProcessIssue(draftFortune?.id, 'Select at least one bucket.', 'create'));
      continue;
    }

    nextFortunes.push({
      id: createNextFortuneId(nextFortunes),
      text: nextText,
      primaryBucket: bucketUpdate.primaryBucket,
      alsoFits: bucketUpdate.alsoFits,
      scope: bucketUpdate.scope,
      active: true,
    });
    didChange = true;
  }

  for (const updatedFortune of updates) {
    const fortuneIndex = nextFortunes.findIndex((fortune) => fortune.id === updatedFortune?.id);
    if (fortuneIndex === -1 || nextFortunes[fortuneIndex].active === false) {
      continue;
    }

    const currentFortune = nextFortunes[fortuneIndex];
    const nextText = typeof updatedFortune?.text === 'string' ? updatedFortune.text.trim() : currentFortune.text;
    if (!nextText) {
      issues.push(buildProcessIssue(updatedFortune?.id, 'Fortune text cannot be empty.', 'update'));
      continue;
    }

    const bucketUpdate = Array.isArray(updatedFortune?.buckets)
      ? normalizeSelectedBuckets(updatedFortune.buckets, currentFortune.primaryBucket)
      : {
          primaryBucket: currentFortune.primaryBucket,
          alsoFits: currentFortune.alsoFits || [],
          scope: currentFortune.scope === 'shared' ? 'shared' : 'specific',
        };

    if (!bucketUpdate) {
      issues.push(buildProcessIssue(updatedFortune?.id, 'Select at least one bucket.', 'update'));
      continue;
    }

    nextFortunes[fortuneIndex] = {
      ...currentFortune,
      text: nextText,
      primaryBucket: bucketUpdate.primaryBucket,
      alsoFits: bucketUpdate.alsoFits,
      scope: bucketUpdate.scope,
      active: true,
    };
    didChange = true;
  }

  if (didChange) {
    writeRegistry({
      fortunes: nextFortunes,
      bucketKeys: registry.bucketKeys,
    });
  }

  return {
    ...buildListResponsePayload({
      fortunes: nextFortunes,
      bucketKeys: registry.bucketKeys,
    }),
    issues,
  };
}

async function handlePatchFortune(request, response, fortuneId) {
  const body = await parseBody(request);
  const registry = readRegistry();
  const fortuneIndex = registry.fortunes.findIndex((fortune) => fortune.id === fortuneId);

  if (fortuneIndex === -1) {
    sendJson(response, 404, { error: 'Fortune not found.' });
    return;
  }

  const currentFortune = registry.fortunes[fortuneIndex];
  if (currentFortune.active === false) {
    sendJson(response, 404, { error: 'Fortune not found.' });
    return;
  }

  const nextText = typeof body.text === 'string' ? body.text.trim() : currentFortune.text;
  if (!nextText) {
    sendJson(response, 400, { error: 'Fortune text cannot be empty.' });
    return;
  }

  const bucketUpdate = Array.isArray(body.buckets)
    ? normalizeSelectedBuckets(body.buckets, currentFortune.primaryBucket)
    : {
        primaryBucket: currentFortune.primaryBucket,
        alsoFits: currentFortune.alsoFits || [],
        scope: currentFortune.scope === 'shared' ? 'shared' : 'specific',
      };

  if (!bucketUpdate) {
    sendJson(response, 400, { error: 'Select at least one bucket.' });
    return;
  }

  const nextFortunes = [...registry.fortunes];
  nextFortunes[fortuneIndex] = {
    ...currentFortune,
    text: nextText,
    primaryBucket: bucketUpdate.primaryBucket,
    alsoFits: bucketUpdate.alsoFits,
    scope: bucketUpdate.scope,
    active: true,
  };

  writeRegistry({
    fortunes: nextFortunes,
    bucketKeys: registry.bucketKeys,
  });

  const savedFortune = toApiFortune(nextFortunes[fortuneIndex]);
  sendJson(response, 200, {
    fortune: savedFortune,
  });
}

async function handleCreateFortune(request, response) {
  const body = await parseBody(request);
  const registry = readRegistry();
  const nextText = typeof body.text === 'string' ? body.text.trim() : '';

  if (!nextText) {
    sendJson(response, 400, { error: 'Fortune text cannot be empty.' });
    return;
  }

  const bucketUpdate = normalizeSelectedBuckets(
    Array.isArray(body.buckets) ? body.buckets : [],
    Array.isArray(body.buckets) ? body.buckets[0] : null
  );

  if (!bucketUpdate) {
    sendJson(response, 400, { error: 'Select at least one bucket.' });
    return;
  }

  const nextFortune = {
    id: createNextFortuneId(registry.fortunes),
    text: nextText,
    primaryBucket: bucketUpdate.primaryBucket,
    alsoFits: bucketUpdate.alsoFits,
    scope: bucketUpdate.scope,
    active: true,
  };

  writeRegistry({
    fortunes: [...registry.fortunes, nextFortune],
    bucketKeys: registry.bucketKeys,
  });

  sendJson(response, 201, {
    fortune: toApiFortune(nextFortune),
  });
}

function handleDeleteFortune(response, fortuneId) {
  const registry = readRegistry();
  const fortuneIndex = registry.fortunes.findIndex((fortune) => fortune.id === fortuneId);

  if (fortuneIndex === -1) {
    sendJson(response, 404, { error: 'Fortune not found.' });
    return;
  }

  const nextFortunes = [...registry.fortunes];
  nextFortunes[fortuneIndex] = {
    ...nextFortunes[fortuneIndex],
    active: false,
    alsoFits: [],
    scope: 'specific',
  };

  writeRegistry({
    fortunes: nextFortunes,
    bucketKeys: registry.bucketKeys,
  });

  sendJson(response, 200, { ok: true, id: fortuneId });
}

const server = http.createServer(async (request, response) => {
  if (!request.url || !request.method) {
    sendJson(response, 400, { error: 'Invalid request.' });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/fortunes') {
    sendJson(response, 200, listResponsePayload());
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/fortunes') {
    try {
      await handleCreateFortune(request, response);
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Unable to create fortune.' });
    }
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/fortunes/process') {
    try {
      const body = await parseBody(request);
      sendJson(response, 200, processBatchChanges(body));
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Unable to process fortunes.' });
    }
    return;
  }

  const fortuneMatch = url.pathname.match(/^\/api\/fortunes\/([^/]+)$/);

  if (fortuneMatch && request.method === 'PATCH') {
    try {
      await handlePatchFortune(request, response, fortuneMatch[1]);
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Unable to save fortune.' });
    }
    return;
  }

  if (fortuneMatch && request.method === 'DELETE') {
    try {
      handleDeleteFortune(response, fortuneMatch[1]);
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Unable to delete fortune.' });
    }
    return;
  }

  sendJson(response, 404, { error: 'Not found.' });
});

server.listen(PORT, HOST, () => {
  console.log(`Fortune Lab API listening on http://${HOST}:${PORT}`);
});
