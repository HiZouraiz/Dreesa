import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { mystore } from "../src/redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { StripeProvider } from "@stripe/stripe-react-native";

let persistor = persistStore(mystore);

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <>
      <Provider store={mystore}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider publishableKey="pk_test_51MfltGLxy1IjoLHfnKtJeoTJoWLFGAoNfCuEflYCjiFcHevnLXqlNIYxooo3KVWv7kOg9rgzOrSjuAXzo22a5t0900dMNgOLdj">
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Splash/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Login/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Register/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="ForgotPassword/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Verification/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="NewPassword/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="UpdatePassword/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="SearchProducts/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="AllProducts/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="ProductsByCategory/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="ProductDetails/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="WriteReview/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="ReviewsByProduct/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Cart/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="AddAddress/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Checkout/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="AccountInformation/index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </StripeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
