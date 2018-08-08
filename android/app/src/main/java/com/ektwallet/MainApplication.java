package com.ektwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;

import org.reactnative.camera.RNCameraPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new CodePush("h52Zx75THodh7X_XxT3ThzTyMyi0ad16ab06-b5c1-4f69-ac84-3b295cac78ce", MainApplication.this, BuildConfig.DEBUG),
                    new SplashScreenReactPackage(),
                    new PickerPackage(),
                    new RNCameraPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
