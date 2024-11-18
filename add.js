// 학생 ID 입력 후 내역을 가져오는 함수
function fetchMileage() {
    const studentId = prompt("학생 ID를 입력하세요:");
    // 서버에서 마일리지 내역을 가져오는 API 호출
    fetch(`/api/mileage/${studentId}`)
        .then(response => response.json())
        .then(data => {
            // 가져온 데이터를 페이지에 표시
            const mileageList = document.getElementById("mileage-list");
            mileageList.innerHTML = JSON.stringify(data);
        });
}
fetchMileage();
