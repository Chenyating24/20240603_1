/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet
*/

let video, detector; // 定義變數 video 和 detector，用來儲存影片和偵測器
let poses = []; // 定義變數 poses，儲存偵測到的姿勢數據
let bikeImg; // 定義變數 bikeImg，儲存自行車圖片
let catImg; // 定義變數 catImg，儲存貓咪圖片

function preload() {
  bikeImg = loadImage("bike.gif"); // 預載入自行車圖片
  catImg = loadImage("cat.gif"); // 預載入貓咪圖片
}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING, // 設定偵測器配置，使用 MULTIPOSE_LIGHTNING 模型
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  ); // 創建 MoveNet 偵測器
}

async function videoReady() {
  console.log("video ready"); // 當影片準備好時在控制台輸出訊息
  await getPoses(); // 開始偵測姿勢
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    }); // 使用偵測器估計影片中的姿勢
  }
  requestAnimationFrame(getPoses); // 持續呼叫 getPoses 函數以實時更新姿勢
}

async function setup() {
  createCanvas(640, 480); // 創建畫布，尺寸為 640x480
  video = createCapture(VIDEO, videoReady); // 捕捉影片並在影片準備好時呼叫 videoReady 函數
  video.size(width, height); // 設定影片的尺寸
  video.hide(); // 隱藏影片元素，只顯示畫布上的影像
  await init(); // 初始化偵測器

  stroke(255); // 設定畫筆顏色為白色
  strokeWeight(5); // 設定畫筆粗細為 5
}

function draw() {
  image(video, 0, 0); // 將影片影像繪製到畫布上
  drawSkeleton(); // 繪製骨架
  // flip horizontal
  let cam = get(); // 獲取當前畫布影像
  translate(cam.width, 0); // 移動畫布原點到右邊
  scale(-1, 1); // 水平翻轉畫布
  image(cam, 0, 0); // 將翻轉後的影像繪製到畫布上
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i]; // 獲取當前姿勢數據

    // 在貓咪圖片顯示在左右兩隻眼睛上
    let leftEye = pose.keypoints[1]; // 獲取左眼的位置
    let rightEye = pose.keypoints[2]; // 獲取右眼的位置

    if (leftEye.score > 0.1) {
      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      image(catImg, leftEye.x, leftEye.y, 50, 50); // 在左眼上顯示貓咪圖片
      pop();
    }

    if (rightEye.score > 0.1) {
      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      image(catImg, rightEye.x, rightEye.y, 50, 50); // 在右眼上顯示貓咪圖片
      pop();
    }

    // 在肩膀上顯示自行車圖片
    let leftShoulder = pose.keypoints[5]; // 獲取左肩的位置
    let rightShoulder = pose.keypoints[6]; // 獲取右肩的位置

    if (leftShoulder.score > 0.1) {
      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      image(bikeImg, leftShoulder.x, leftShoulder.y - 75, 75, 75); // 在左肩上顯示縮小的自行車圖片
      pop();
    }

    if (rightShoulder.score > 0.1) {
      push();
      imageMode(CENTER); // 設定圖像模式為中心對齊
      image(bikeImg, rightShoulder.x, rightShoulder.y - 75, 75, 75); // 在右肩上顯示縮小的自行車圖片
      pop();
    }

    // 在頭部上方顯示文字
    let nose = pose.keypoints[0]; // 獲取鼻子的位置
    if (nose.score > 0.1) {
      push();
      textSize(40); // 設定文字大小為 40
      fill(255, 0, 0); // 設定文字顏色為紅色
      textAlign(CENTER, CENTER); // 設定文字對齊方式為中心對齊
      scale(-1, 1); // 水平翻轉文字
      text("408730413,陳雅婷", -nose.x, nose.y - 200); // 在頭部上方顯示文字
      pop();
    }

      }
    }