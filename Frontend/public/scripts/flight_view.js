const tooltip = document.getElementById("seat-tooltip");
    const tooltipName = document.getElementById("tooltip-name");
    const tooltipGender = document.getElementById("tooltip-gender");
    const tooltipNationality = document.getElementById("tooltip-nationality");
    const tooltipAge = document.getElementById("tooltip-age");
    const container = document.querySelector(".content");

    // seatCode üretici: columns = kolon sayısı, startRow = hangi satırdan başlasın
    function setupSeatCodes(selector, columns, startRow) {
      const seats = document.querySelectorAll(selector);
      const rows = 10;
      seats.forEach((seat, index) => {
        const colIndex = Math.floor(index / rows); // 0..columns-1
        const rowIndex = index % rows;            // 0..9
        const letter = String.fromCharCode(65 + colIndex); // A,B,C...
        const code = (startRow + rowIndex) + letter;       // 1A, 11C, vb.
        seat.textContent = code;
        seat.dataset.seat = code;
      });
    }

    // Business: 4 kolon, 1–10
    setupSeatCodes(".seat-business", 4, 1);
    // Basic: 6 kolon, 11–20 (Business’ın devamı)
    setupSeatCodes(".seat-basic", 6, 11);

    // DB'den veri bağlamak için örnek (gerçek veriyi siz dolduracaksınız):

    // this will add details and make the hover functional
    function addDetails(seatID, name, gender, nationality, age) {
       const sID = document.getElementById(seatID);
      sID.dataset.name = name;
      sID.dataset.gender = gender;
      sID.dataset.nationality = nationality;
      sID.dataset.age = age;
      sID.classList.add("legend-taken");
    
      sID.addEventListener("mouseenter", () => showTooltip(sID));
      sID.addEventListener("mouseleave", hideTooltip);
      sID.addEventListener("focus", () => showTooltip(sID));
      sID.addEventListener("blur", hideTooltip);
   
    }
    //addDetails("6C","wissam the gigachad","Male","Turkish","34");
    //addDetails("20F","abdelrahman","Male","Turkish","34");
    //addDetails("12A","mustafa","Male","Turkish","34");
    

    function showTooltip(seat) {
      const name = seat.dataset.name || "";
      const gender = seat.dataset.gender || "";
      const nationality = seat.dataset.nationality || "";
      const age = seat.dataset.age || "";

      tooltipName.textContent = name;
      tooltipGender.textContent = gender;
      tooltipNationality.textContent = nationality;
      tooltipAge.textContent = age;

      const seatRect = seat.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const centerX = seatRect.left - containerRect.left + seatRect.width / 2;
      const top = seatRect.top - containerRect.top;

      tooltip.style.left = centerX + "px";
      tooltip.style.top = top + "px";
      tooltip.style.display = "block";
    }

    function hideTooltip() {
      tooltip.style.display = "none";
    }


    container.addEventListener("mouseleave", hideTooltip);