import BurgerSequence from "@/components/BurgerSequence";
import MainApp from "@/components/MainApp";
import { CartProvider } from "@/components/cart/CartProvider";

export default function Home() {
  return (
    <CartProvider>
      <main className="bg-void">
        <BurgerSequence />
        <MainApp />
      </main>
    </CartProvider>
  );
}
