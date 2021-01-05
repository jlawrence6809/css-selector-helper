import { useContext } from "react";
import { StoreContext } from "../state/Store";

// todo: make this a hook?
const PlusDarkTheme = (classString: string) => {
    const {state} = useContext(StoreContext);
    return classString + (state.darkMode ? ' dark-theme' : '');
}
export default PlusDarkTheme;
