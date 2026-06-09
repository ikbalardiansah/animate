import ShopBestDeal from "./components/shop-best-deal";
import TikTokSection from "@/app/(main)/components/sosmed";
import { PromoCountdown } from "@/app/(main)/components/countdown";
import CategorySection from "@/app/(main)/components/category";
import HeroSlider from "@/app/(main)/components/slider";
import ActivityPopup from "@/app/(main)/components/pop-up";
import ExploreSeries from "@/app/(shop)/shop/components/shop-series";

export default function ShopPage() {
  return (
    <div>
      <HeroSlider />
      <ShopBestDeal />
      <ExploreSeries />
      <ActivityPopup />
      <CategorySection />
      <TikTokSection />
      <PromoCountdown />
    </div>
  );
}
