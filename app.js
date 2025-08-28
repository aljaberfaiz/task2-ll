(() => {
  const supportsScrollAnim = CSS && CSS.supports && CSS.supports("animation-timeline: scroll()");
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (supportsScrollAnim || prefersReduced) return; 

  const driver = document.querySelector(".scrollDriver");
  const stage  = document.querySelector("svg");

  const el = {
    hillsBack:  document.getElementById("hills-back"),
    hillsMid:   document.getElementById("hills-mid"),
    hillsFront: document.getElementById("hills-front"),
    cloud1:     document.getElementById("cloud1"),
    cloud2:     document.getElementById("cloud2"),
    cloud3:     document.getElementById("cloud3"),
    cloud4:     document.getElementById("cloud4"),
    sun:        document.getElementById("sun"),
    skyA:       document.getElementById("skyA"),
    skyB:       document.getElementById("skyB"),
    sunCore:    document.getElementById("sunCore"),
    sunHalo:    document.getElementById("sunHalo"),
    scene3:     document.getElementById("scene3"),
    stars:      document.getElementById("stars"),
    endText:    document.getElementById("endText"),
    prompt:     document.getElementById("prompt"),
  };


  let active = true, ticking = false;
  const io = new IntersectionObserver((entries) => {
    active = entries[0]?.isIntersecting ?? true;
  }, { threshold: 0 });
  io.observe(stage);

  const lerp = (a,b,t) => a + (b - a) * t;
  const clamp = (n,min,max) => Math.max(min, Math.min(max, n));

  const step = () => {
    ticking = false;
    if (!active) return;

    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const t = clamp(scrollY / scrollable, 0, 1); 


    const backY  = lerp(0, -18 * innerHeight / 100, t);
    const midY   = lerp(0, -28 * innerHeight / 100, t);
    const frontY = lerp(0, -40 * innerHeight / 100, t);

    el.hillsBack.style.transform  = `translate3d(0, ${backY}px, 0)`;
    el.hillsMid.style.transform   = `translate3d(0, ${midY}px, 0)`;
    el.hillsFront.style.transform = `translate3d(0, ${frontY}px, 0)`;


    el.cloud1.style.transform = `translate3d(${t * 40 * innerWidth/100}px, 0, 0)`;
    el.cloud2.style.transform = `translate3d(${t * 70 * innerWidth/100}px, 0, 0)`;
    el.cloud3.style.transform = `translate3d(${t * -60 * innerWidth/100}px, 0, 0)`;
    el.cloud4.style.transform = `translate3d(${t * -30 * innerWidth/100}px, ${t * 0.04 * innerHeight}px, 0)`;


    el.sun.style.transform = `translate3d(${t * 380}px, ${t * -30}px, 0)`;


    const skyA = `rgb(${Math.round(lerp(32, 49, t))},${Math.round(lerp(58, 73, t))},${Math.round(lerp(147, 180, t))})`;
    el.skyA.setAttribute("stop-color", skyA);
    el.skyB.setAttribute("stop-color", t < 1 ? "#121b33" : "#121b33");
    el.sunCore.setAttribute("stop-color", t < 1 ? "#ffd36e" : "#ffd36e");
    el.sunHalo.setAttribute("stop-color", t < 1 ? "#ffb36a" : "#ffb36a");


    el.prompt.setAttribute("opacity", (1 - t).toFixed(3));

 
    const nightT = clamp((t - 0.75) / 0.25, 0, 1);
    el.scene3.setAttribute("opacity", nightT.toFixed(3));
    el.stars.setAttribute("opacity", (nightT * 0.6).toFixed(3));
    el.endText.setAttribute("opacity", (nightT * 0.85).toFixed(3));
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(step);
      ticking = true;
    }
  };


  const setVH = () => document.documentElement.style.setProperty("--vh", `${innerHeight}px`);
  setVH(); addEventListener("resize", setVH);

  
  step();
  addEventListener("scroll", onScroll, { passive: true });


  window.onbeforeunload = () => scrollTo(0,0);
})();
