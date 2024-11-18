let mileageCategories = []; // 클라이언트에서 관리하는 마일리지 카테고리 목록
let students = []; // 학생 목록

function handleEnter(event) {
    if (event.key === 'Enter') {
        document.getElementById("authenticate-button").click(); // 조회 버튼 클릭과 동일한 동작 수행
    }
}

function authenticate() {
    const password = document.getElementById("teacher-password").value;
    const correctPassword = "1002"; // 고정된 비밀번호

    if (password === correctPassword) {
        alert("비밀번호 인증 성공!");
        document.getElementById("mileage-management").style.display = "block"; // 다음 화면 표시
        document.getElementById("teacher-password").disabled = true; // 비밀번호 입력 비활성화
        document.getElementById("authenticate-button").disabled = true; // 조회 버튼 비활성화
        fetchStudents(); // 학생 목록 초기 로드
        fetchMileageCategories(); // 마일리지 카테고리 초기 로드
    } else {
        alert("비밀번호가 틀렸습니다.");
    }
}

function fetchStudents() {
    // 서버에서 학생 목록을 불러오기
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            students = data;
            updateStudentSelect();
            updateDeleteStudentSelect();
        })
        .catch(error => console.error('학생 목록 불러오기 실패:', error));
}

function updateStudentSelect() {
    const studentSelect = document.getElementById("student-id");
    studentSelect.innerHTML = '<option disabled selected>학생을 선택하세요</option>';

    students.forEach(student => {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });
}

function updateDeleteStudentSelect() {
    const deleteStudentSelect = document.getElementById("delete-student-id");
    deleteStudentSelect.innerHTML = '<option disabled selected>삭제할 학생을 선택하세요</option>';

    students.forEach(student => {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name;
        deleteStudentSelect.appendChild(option);
    });
}

function registerStudent() {
    const name = document.getElementById("student-name").value;

    if (!name) {
        alert("학생 이름을 입력하세요.");
        return;
    }

    fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
        alert(`학생 등록 완료: ${data.name}`);
        fetchStudents(); // 등록 후 학생 목록 갱신
    })
    .catch(error => console.error('학생 등록 실패:', error));
}

function deleteStudent() {
    const studentId = document.getElementById("delete-student-id").value;

    if (!studentId) {
        alert("삭제할 학생을 선택하세요.");
        return;
    }

    fetch(`/api/delete-student/${studentId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchStudents(); // 삭제 후 목록 갱신
    })
    .catch(error => console.error('학생 삭제 실패:', error));
}

function fetchMileageCategories() {
    fetch('/api/mileage-categories')
        .then(response => response.json())
        .then(categories => {
            mileageCategories = categories;
            updateMileageCategorySelect();
        })
        .catch(error => console.error('마일리지 카테고리 불러오기 실패:', error));
}

function updateMileageCategorySelect() {
    const mileageSelect = document.getElementById("mileage-type");
    mileageSelect.innerHTML = '<option disabled selected>마일리지 카테고리를 선택하세요</option>';

    mileageCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.points;
        option.textContent = `${category.name} (${category.points}점)`;
        mileageSelect.appendChild(option);
    });
}

function addMileageCategory() {
    const name = document.getElementById("mileage-category-name").value;
    const points = parseInt(document.getElementById("mileage-category-points").value);

    if (!name || isNaN(points)) {
        alert("카테고리 이름과 포인트를 올바르게 입력하세요.");
        return;
    }

    const newCategory = { name, points };

    fetch('/api/add-mileage-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
    })
    .then(response => response.json())
    .then(data => {
        alert(`마일리지 카테고리 추가 완료: ${data.category.name} (${data.category.points}점)`);
        fetchMileageCategories(); // 서버에서 카테고리 목록 다시 불러와 동기화
    })
    .catch(error => console.error('카테고리 추가 실패:', error));
}

function addMileage() {
    const studentId = document.getElementById("student-id").value;
    const points = parseInt(document.getElementById("mileage-type").value);
    const mileageType = document.getElementById("mileage-type").options[document.getElementById("mileage-type").selectedIndex].text;

    if (!studentId || isNaN(points)) {
        alert("학생과 마일리지 카테고리를 선택하세요.");
        return;
    }

    fetch('/api/add-mileage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mileageType, points })
    })
    .then(response => response.json())
    .then(data => {
        alert("마일리지 부여 완료");
    })
    .catch(error => console.error("마일리지 추가 실패:", error));
}

document.addEventListener("DOMContentLoaded", fetchMileageCategories);
