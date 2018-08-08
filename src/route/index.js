import {
	Navigation,
	ScreenVisibilityListener
} from "react-native-navigation";


import assetDetails from "../layouts/assetDetails";
import aboutUs from "../layouts/aboutUs";
import createSuccess from "../layouts/createSuccess";
import createToken from "../layouts/createToken";
import createToken2 from "../layouts/createToken2";
import createToken3 from "../layouts/createToken3";
import createWallet from "../layouts/createWallet";
import currencyList from "../layouts/currencyList";
import exDetails from "../layouts/exDetails";
import exEkt from "../layouts/exEkt";
import inPk from "../layouts/inPk";
import launch from "../layouts/launch";
import lock from "../layouts/lock";
import qr from "../layouts/qr";
import register from "../layouts/register";
import wakeUp from "../layouts/wakeUp";


export function registerScreens() {
	
	Navigation.registerComponent("wallet.assetDetails", () => assetDetails);
	Navigation.registerComponent("wallet.aboutUs", () => aboutUs);
	Navigation.registerComponent("wallet.createSuccess", () => createSuccess);
	Navigation.registerComponent("wallet.createToken", () => createToken);
	Navigation.registerComponent("wallet.createToken2", () => createToken2);
	Navigation.registerComponent("wallet.createToken3", () => createToken3);
	Navigation.registerComponent("wallet.createWallet", () => createWallet);
	Navigation.registerComponent("wallet.currencyList", () => currencyList);
	Navigation.registerComponent("wallet.exDetails", () => exDetails);
	Navigation.registerComponent("wallet.exEkt", () => exEkt);
	Navigation.registerComponent("wallet.inPk", () => inPk);
	Navigation.registerComponent("wallet.launch", () => launch);
	Navigation.registerComponent("wallet.lock", () => lock);
	Navigation.registerComponent("wallet.qr", () => qr);
	Navigation.registerComponent("wallet.register", () => register);
	Navigation.registerComponent("wallet.wakeUp", () => wakeUp);
   
}

export function registerScreenVisibilityListener() {
	new ScreenVisibilityListener({
		willAppear: ({
			screen
		}) => console.log(`Displaying screen ${screen}`),
		didAppear: ({
			screen,
			startTime,
			endTime,
			commandType
		}) => console.log("screenVisibility", `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
		willDisappear: ({
			screen
		}) => console.log(`Screen will disappear ${screen}`),
		didDisappear: ({
			screen
		}) => console.log(`Screen disappeared ${screen}`)
	}).register();
}