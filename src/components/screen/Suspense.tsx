import React, { ReactElement } from 'react';

import styled from 'styled-components/native';

interface Props {
  error?: boolean;
  message?: string;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${({ error }): string => (error ? 'red' : '#64F0CC')};
`;

const StyledText = styled.Text`
  font-size: 30px;
  font-weight: 600;
  color: #fff;
`;

const SuspenseScreen = ({ error, message }: Props): ReactElement => {
  return (
    <Container error={error}>
      <StyledText>{error ? 'Error' : message || 'Suspense'}</StyledText>
    </Container>
  );
};

export default SuspenseScreen;
