import React from 'react';

export const AlgoSignerChecker = (props: { isAlgoSigner: boolean }) => {
  let { isAlgoSigner } = props;
  return isAlgoSigner ? <p>AlgoSigner found!</p> : <p>AlgoSigner not found!</p>
}
