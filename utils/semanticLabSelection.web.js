import {
  getSemanticLabBaseSelection,
  roundConfidence,
} from './fortuneLogic';
import { analyzeSemanticFallbackInput } from './semanticFallback';

export async function getSemanticLabSelection(input, options = {}) {
  const normalizedInput = String(input || '').trim().toLowerCase();
  const selection = await getSemanticLabBaseSelection(normalizedInput, options);
  const semanticPreview = analyzeSemanticFallbackInput(normalizedInput);
  const semanticLab = {
    bucket: semanticPreview.bucket || 'unknown',
    accepted: Boolean(semanticPreview.accepted),
    reason: semanticPreview.reason || null,
    confidence: roundConfidence(semanticPreview.accepted ? (semanticPreview.confidence || 0) : 0),
    debug: semanticPreview.debug || null,
  };

  return {
    ...selection,
    analysis: {
      ...selection.analysis,
      lab: {
        ...selection.analysis?.lab,
        semantic: semanticLab,
      },
    },
  };
}
