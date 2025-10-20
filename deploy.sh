echo "🔨 Building React app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "📦 Deploying to GitHub Pages..."
npm run deploy

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi

echo "✅ Deployment complete!"
echo "🌐 Visit: https://harmonicsandhealing.github.io/harmonicsandhealing"
