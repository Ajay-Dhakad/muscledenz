"use client"


import { AddressSelector } from "@/components/checkout/address-selector"
import { OrderSummary } from "@/components/checkout/order-summary"
import { type Payment, PaymentForm } from "@/components/checkout/payment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateDiscountedPrice } from "@/lib/calculateDiscountedPrice"
import { removeItemsToCart } from "@/redux/actions/cart-actions"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import strapi from "@/sdk"
import { CartType } from "@/types/cart"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
type Step = "address" | "payment" | "success"


export default function CartCheckoutPage() {
    const { cart } = useAppSelector((state) => state.cart) || []
    const items = cart.cartItems as CartType[];
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [step, setStep] = useState<Step>("address")
    const [placing, setPlacing] = useState(false)
    const [addressId, setAddressId] = useState(null)
    const [payment, setPayment] = useState<Payment>({ method: "cod" });
    const { data: session } = useSession()
    const userDocumentId = session?.user.id;

    const placeOrder = async () => {
        if (!items.length) {
            toast.error("Your cart is empty.")
            return;
        }
        if (!addressId) {
            toast.error("Please select address");
            return;
        }
        setPlacing(true)
        try {
            const res = await Promise.all(items.map(async (item) => {
                const res = await strapi.create("orders", {
                    orderStatus: "pending",
                    user: userDocumentId,
                    product: item.product.documentId,
                    quantity: Number(item.quantity),
                    paymentStatus: payment.method === "cod" ? "pending" : "paid",
                    address: addressId,
                    amount: calculateDiscountedPrice({
                        price: Number(item.product.price),
                        discountPercentage: Number(item.product.discount),
                    }) * Number(item.quantity),
                    paymentMethod: payment.method === "cod" ? "COD" : "UPI",
                })
                await dispatch(removeItemsToCart(item.product.documentId))
                return res
            }))
            setStep("success")
            console.log("[v0] Cart order placed:", res);
            toast.success("Order placed successfully");

        } catch (err) {
            console.log("[v0] Error placing cart order:", (err as Error).message);
            toast.error("Something went wrong placing your order.")
        } finally {
            setPlacing(false)
        }
    }



    return (
        <main className="max-w-5xl mx-auto p-4 md:p-8">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Checkout — Cart</h1>
                <p className="text-sm text-muted-foreground">Complete your order for all items in your cart.</p>
            </header>

            {step !== "success" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-pretty">{step === "address" ? "Shipping address" : "Payment"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {step === "address" ? (
                                    <>
                                        <AddressSelector setStep={setStep} setAddressId={setAddressId} selectedId={addressId} />
                                    </>
                                ) : (
                                    <PaymentForm
                                        value={payment}
                                        onUpdate={(p) => setPayment((prev) => ({ ...prev, ...p }))}
                                        onBack={() => setStep("address")}
                                        onPlaceOrder={placeOrder}
                                        placing={placing}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="lg:col-span-1 space-y-4">
                        <OrderSummary items={items} />
                    </aside>
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-2 text-pretty">Order placed!</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Thank you for your purchase. A confirmation message will be sent shortly.
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={() => router.push("/orders")}>Your Orders</Button>
                        </div>
                    </CardContent>

                </Card>
            )}
        </main>
    )
}