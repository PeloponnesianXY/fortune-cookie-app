import React from 'react';

import FortuneLab from './FortuneLab';
import ScreenLab from './ScreenLab';
import SemanticLab from './SemanticLab';

export default function DevWebLabs({ route }) {
  if (route === 'semantic') {
    return <SemanticLab />;
  }

  if (route === 'screen') {
    return <ScreenLab />;
  }

  if (route === 'fortune') {
    return <FortuneLab />;
  }

  return null;
}
