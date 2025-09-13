import { NextRequest, NextResponse } from "next/server";

// Mock data - in a real app, replace with DB calls
let products = [
  { id: 1, name: "Sneaker Alpha", price: 99.9, category: "sneakers", image: "/img/1.jpg" },
  { id: 2, name: "Sneaker Beta", price: 129.9, category: "sneakers", image: "/img/2.jpg" },
  { id: 3, name: "Boot Gamma", price: 149.9, category: "boots", image: "/img/3.jpg" },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const item = products.find((p) => String(p.id) === String(id));
      return NextResponse.json(item ?? null);
    }

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ message: "Məhsullar gətirilə bilmədi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = products.length ? Math.max(...products.map((p) => Number(p.id))) + 1 : 1;
    const newItem = { id, ...body };
    products.push(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Məhsul əlavə olunmadı" }, { status: 400 });
  }
}
