import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import User from './pages/User';

const AppStack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Main"
          component={Main}
          options={{
            title: 'Usuários',
            headerStyle: {
              backgroundColor: '#7159c1',
            },
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
          }}
        />
        <AppStack.Screen
          name="User"
          component={User}
          options={({ route }) => ({
            title: route.params.user.name,
            headerStyle: {
              backgroundColor: '#7159c1',
            },
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
          })}
        />
      </AppStack.Navigator>

    </NavigationContainer>
  );
}
