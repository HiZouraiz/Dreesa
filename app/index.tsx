import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Image } from "react-native";
import appStyle from "../src/constants/Colors";
import * as Updates from "expo-updates";

const StartPage = () => {
  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    UpdateApplication();
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  }, []);

  const UpdateApplication = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();

        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log(`Error fetching latest update: ${error}`);
    }
  };

  if (!isSplash) {
    return <Redirect href={"/(tabs)/home"} />;
  } else {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center`}
        style={{ backgroundColor: appStyle.Colors.primaryColor }}
      >
        <Image
          resizeMode="contain"
          className="w-[250px] h-[250px]"
          source={appStyle.SPLASH_ICON}
        />
        <Image
          resizeMode="contain"
          className="w-[280px] h-[110px] mt-2"
          source={appStyle.SPLASH_LOGO}
        />
      </SafeAreaView>
    );
  }
};

export default StartPage;
