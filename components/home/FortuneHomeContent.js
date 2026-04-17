import React from 'react';

import FortuneCard from './FortuneCard';

// This stays prop-driven so production and Screen Lab both render the same home UI.
export default function FortuneHomeContent(props) {
  return <FortuneCard {...props} />;
}
