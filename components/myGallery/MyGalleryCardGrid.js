// components/myGallery/MyGalleryCardGrid.js

export default function MyGalleryCardGrid({ items }) {
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <div
          key={item.photoCardId}
          className="bg-black text-white rounded p-4 border"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-auto mb-2"
          />
          <div className="font-semibold">{item.name}</div>
          <div>
            {item.grade} | {item.genre}
          </div>
          <div>가격: {item.price}P</div>
          <div>수량: {item.totalRegistered}</div>
          <div className="mt-2 text-yellow-300 font-bold">최애포토</div>
        </div>
      ))}
    </div>
  );
}
