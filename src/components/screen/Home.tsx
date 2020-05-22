import { Animated, Text } from 'react-native';
import type {
  HomeFriendQuery,
  HomeFriendQueryResponse,
} from './__generated__/HomeFriendQuery.graphql';
import {
  preloadQuery,
  usePreloadedQuery,
  useSubscription,
} from 'react-relay/hooks';
import Friends from '../ui/Friends';
import type { HomeUserSubscriptionResponse } from './__generated__/HomeUserSubscription.graphql';
import React from 'react';
import { RecordSourceSelectorProxy } from 'relay-runtime';
import { RootStackNavigationProps } from '../navigation/RootStackNavigator';
import environment from '../../relay/RelayEnvironment';
import graphql from 'babel-plugin-relay/macro';
import styled from 'styled-components/native';

const Container = styled.View`
  position: relative;
  flex: 1;
  align-self: stretch;
  overflow: scroll;
  background-color: ${({ theme }): string => theme.background};

  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

interface Props {
  navigation: RootStackNavigationProps<'Main'>;
}

const FriendQuery = graphql`
  query HomeFriendQuery {
    friends {
      id
      email
      name
      photoURL
    }
  }
`;

const UserSubscription = graphql`
  subscription HomeUserSubscription {
    userSignedIn {
      id
      email
    }
  }
`;

function Home(props: Props): React.ReactElement {
  const [signin, setSignin] = React.useState<boolean>(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const result = preloadQuery(
    environment,
    FriendQuery,
    {},
    { fetchPolicy: 'store-or-network' },
  );

  const data: HomeFriendQueryResponse = usePreloadedQuery<HomeFriendQuery>(
    FriendQuery,
    result,
  );

  // Subscription
  const subscriptionConfig = React.useMemo(
    () => ({
      variables: {},
      subscription: UserSubscription,
      onCompleted: (): void =>
        console.log('[Home] subscription is now closed.'),
      updater: (
        store: RecordSourceSelectorProxy<{}>,
        data: HomeUserSubscriptionResponse,
      ): void => {
        if (data) {
          setSignin(true);
        }
      },
    }),
    [],
  );

  useSubscription(subscriptionConfig);

  React.useEffect((): void => {
    const fadeIn = (): void => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setSignin(false), 2000);
      });
    };

    const fadeOut = (): void => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    signin ? fadeIn() : fadeOut();
  }, [signin]);

  return (
    <Container>
      <React.Suspense fallback={'Home fallback...'}>
        <Friends data={data} />
        {/* <AlertContainer signin={signin} /> */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 5,
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: '#00FACB',
            opacity: fadeAnim,
          }}
        >
          <Text>A new device has signed in</Text>
        </Animated.View>
      </React.Suspense>
    </Container>
  );
}

export default Home;