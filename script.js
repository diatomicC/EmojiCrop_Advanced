const uploadBtn = document.getElementById("upload-btn");
const dropZone = document.getElementById("drop-zone");

// 파일 업로드 기능 활성화
uploadBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = () => {
    handleFileDrop(fileInput.files);
  };
  fileInput.click();
});

// 드래그 앤 드랍 기능 활성화
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFileDrop(e.dataTransfer.files);
});

// 업로드한 파일 처리 함수
function handleFileDrop(files) {
  // 카카오톡 버튼 클릭 시
  document.querySelector("#kakao-btn").addEventListener("click", function () {
    // 파일 나누기
    let slices = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        
        let sliceWidth = img.width / 4;
        let sliceHeight = img.height / 4;
        
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = 360;
            sliceCanvas.height = 360;
            let sliceCtx = sliceCanvas.getContext("2d");
            sliceCtx.drawImage(canvas, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 0, 0, sliceCanvas.width, sliceCanvas.height);
            slices.push(sliceCanvas.toDataURL("image/png"));
          }
        }
        
        if (slices.length == 16) {
          // zip 파일 만들기
          let zip = new JSZip();
          for (let k = 0; k < slices.length; k++) {
            zip.file("kakao/" + (k + 1) + ".png", slices[k].split(",")[1], { base64: true });
          }
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "카카오톡(1).zip");
          });
        }
      };
    }
  });

  // 네이버 OGQ 버튼 클릭 시
  document.querySelector("#naver-btn").addEventListener("click", function () {
    // 파일 나누기
    let slices = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      
        let sliceWidth = img.width / 4;
        let sliceHeight = img.height / 4;
      
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = 740;
            sliceCanvas.height = 640;
            let sliceCtx = sliceCanvas.getContext("2d");
            // Add transparent pixels to the left and right of each slice
            sliceCtx.fillStyle = "rgba(0, 0, 0, 0)";
            sliceCtx.fillRect(0, 0, 50, 640);
            sliceCtx.fillRect(690, 0, 50, 640);
            sliceCtx.drawImage(canvas, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 50, 0, 640, 640);
            slices.push(sliceCanvas.toDataURL("image/png"));
          }
        }
      
        // Add a 740*640px PNG file to the slices array
        let fullCanvas = document.createElement("canvas");
        fullCanvas.width = 740;
        fullCanvas.height = 640;
        let fullCtx = fullCanvas.getContext("2d");
        fullCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 50, 0, 640, 640);
      
        if (slices.length == 16) {
          // zip 파일 만들기
          let zip = new JSZip();
          for (let k = 0; k < slices.length; k++) {
            zip.file("ogq/" + (k + 1) + ".png", slices[k].split(",")[1], { base64: true });
          }
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "네이버OGQ(1).zip");
          });
        }
      };
    }
  });

  // 두번째 카카오톡 버튼 클릭 시
  document.querySelector("#kakao-btn2").addEventListener("click", function () {
    // 파일 나누기
    let slices = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        
        let sliceWidth = img.width / 4;
        let sliceHeight = img.height / 4;
        
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = 360;
            sliceCanvas.height = 360;
            let sliceCtx = sliceCanvas.getContext("2d");
            sliceCtx.drawImage(canvas, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 0, 0, sliceCanvas.width, sliceCanvas.height);
            slices.push(sliceCanvas.toDataURL("image/png"));
          }
        }
        
        if (slices.length == 16) {
          // zip 파일 만들기
          let zip = new JSZip();
          for (let k = 0; k < slices.length; k++) {
            zip.file("kakao/" + (k + 17) + ".png", slices[k].split(",")[1], { base64: true });
          }
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "카카오톡(2).zip");
          });
        }
      };
    }
  });

  // 두번째 네이버 OGQ 버튼 클릭 시
  document.querySelector("#naver-btn2").addEventListener("click", function () {
    // 파일 나누기
    let slices = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      
        let sliceWidth = img.width / 4;
        let sliceHeight = img.height / 4;
      
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            let sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = 740;
            sliceCanvas.height = 640;
            let sliceCtx = sliceCanvas.getContext("2d");
            // Add transparent pixels to the left and right of each slice
            sliceCtx.fillStyle = "rgba(0, 0, 0, 0)";
            sliceCtx.fillRect(0, 0, 50, 640);
            sliceCtx.fillRect(690, 0, 50, 640);
            sliceCtx.drawImage(canvas, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 50, 0, 640, 640);
            slices.push(sliceCanvas.toDataURL("image/png"));
          }
        }
      
        // Add a 740*640px PNG file to the slices array
        let fullCanvas = document.createElement("canvas");
        fullCanvas.width = 740;
        fullCanvas.height = 640;
        let fullCtx = fullCanvas.getContext("2d");
        fullCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 50, 0, 640, 640);
      
        if (slices.length == 16) {
          // zip 파일 만들기
          let zip = new JSZip();
          for (let k = 0; k < slices.length; k++) {
            zip.file("ogq/" + (k + 17) + ".png", slices[k].split(",")[1], { base64: true });
          }
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, "네이버OGQ(2).zip");
          });
        }
      };
    }
  });

}