// components/myGallery/MyGalleryCardGrid.js

import MyGalleryCard from "./MyGalleryCard";

export default function MyGalleryCardGrid({ items }) {
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <MyGalleryCard
        key={item.saleId}
        {...item}
        />
        // <div
        //   key={item.photoCardId}
        //   className="bg-black text-white rounded p-4 border"
        // >
        //   <img
        //     src={item.imageUrl}
        //     alt={item.name}
        //     className="w-full h-auto mb-2"
        //   />
        //   <div className="font-semibold">{item.name}</div>
        //   <div>
        //     {item.grade} | {item.genre}
        //   </div>
        //   <div>가격: {item.price}P</div>
        //   <div>
        //     수량: {item.quantity}
        //     {/* / {item.initialQuantity} */}
        //   </div>
        //   <div className="mt-2 text-yellow-300 font-bold">
        //     판매자 : {item.sellerNickname}
        //   </div>
        // </div>
      ))}
    </div>
  );
}
