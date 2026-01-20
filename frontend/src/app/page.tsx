export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          PicMe <span className="text-blue-600">🎨</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          イラストレーターのための簡単ポートフォリオサイト作成サービス
        </p>
        <div className="space-x-4">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            無料で始める
          </button>
          <button className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            詳しく見る
          </button>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          <p>Phase 0: 環境構築完了 ✅</p>
          <p className="mt-2">Backend: Spring Boot 3.x + PostgreSQL</p>
          <p>Frontend: Next.js 15 + TailwindCSS</p>
        </div>
      </div>
    </div>
  );
}
