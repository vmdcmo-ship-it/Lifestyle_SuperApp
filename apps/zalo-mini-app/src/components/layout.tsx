import { App, ZMPRouter, AnimationRoutes, Route } from "zmp-ui";

import HomePage from "@/pages/home";
import FoodPage from "@/pages/food";
import WalletPage from "@/pages/wallet";
import LoyaltyPage from "@/pages/loyalty";
import ProfilePage from "@/pages/profile";
import BottomNav from "./bottom-nav";

export default function Layout() {
  return (
    <App>
      <ZMPRouter>
        <AnimationRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </AnimationRoutes>
        <BottomNav />
      </ZMPRouter>
    </App>
  );
}
