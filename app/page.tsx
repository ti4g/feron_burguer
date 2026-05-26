import BurgerSequence from "@/components/BurgerSequence";
import Menu from "@/components/menu/Menu";
import { CartProvider } from "@/components/cart/CartProvider";
import CartBar from "@/components/cart/CartBar";

export default function Home() {
  return (
    <CartProvider>
      <main className="bg-void">
        <BurgerSequence />
        <Menu />
      </main>
      <CartBar />
    </CartProvider>
  );
}
