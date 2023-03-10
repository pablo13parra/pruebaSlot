
$(window).on("load", function () {
  const items = [];

  $.ajax({
    cache: false, dataType: 'json', type: 'get',
    url: '../assets/mocks/xmpl.json'
  }).then((resp) => {
    for (let i = 0; i < resp.response.length; i++) {
      items.push(resp.response[i].archive)
    }
    starting(items);

  })

});

function starting(items) {
  const doors = document.querySelectorAll('.door');

  document.querySelector('#spinner').addEventListener('click', spin);
  document.querySelector('#reseter').addEventListener('click', init);

  function init(firstInit = true, groups = 1, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      const pool = [];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));
        console.log(pool);
        boxesClone.addEventListener(
          'transitionstart',
          function () {
            door.dataset.spinned = '1';
            this.querySelectorAll('.box').forEach((box) => {
              box.style.filter = 'blur(1px)';
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          'transitionend',
          function () {
            this.querySelectorAll('.box').forEach((box, index) => {
              box.style.filter = 'blur(0)';
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('img');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        if (pool[i] !== (undefined || null)) {
          box.src = pool[i];
        }
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  async function spin() {
    init(false, 1, 2);

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 15));
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      // i = posici??n en la que va a caer
      const i = Math.floor(1);
      console.log(m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
}

function start() {
  document.getElementById('dno-1').classList.remove('dno');
  document.getElementById('dno-2').classList.remove('dno');
  document.getElementById('frames').classList.add('Animation-frames');
  setTimeout(() => {
    document.getElementById('dno-1').classList.add('dno');
    document.getElementById('dno-2').classList.add('dno');
    document.getElementById('frames').classList.remove('Animation-frames');
  }, 2000)
}