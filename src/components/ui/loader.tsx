const Loader = function() {
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-lg font-medium">Загрузка</p>
    </div>
  );
}

export default Loader;