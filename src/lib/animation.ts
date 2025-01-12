import { gsap } from "@/lib/gsap";

export const pageTransition = (
  transitionElement: HTMLElement, 
  secondaryElement: HTMLElement,
  logoElement: HTMLElement
) => {
  const tl = gsap.timeline();
  
  // Initial states
  tl.set(transitionElement, {
    left: "-100%",
    opacity: 1,
    zIndex: 999,
  })
  .set(secondaryElement, {
    left: "-100%",
    opacity: 0,
    zIndex: 1000,
  })
  .set(logoElement, {
    opacity: 0,
    scale: 0,
    zIndex: 1001,
  })
  
  // Black layer slides in
  .to(transitionElement, {
    left: 0,
    duration: 0.6,
    ease: "power2.inOut",
  })
  
  // Logo appears
  .to(logoElement, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "back.out(1.7)",
  }, "-=0.3")
  
  // Green overlay fades in with gradient
  .to(secondaryElement, {
    left: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power2.inOut",
  }, "-=0.4")
  
  // Hold state
  .to({}, { duration: 0.4 })
  
  // Exit sequence
  .to(logoElement, {
    opacity: 0,
    scale: 0,
    duration: 0.4,
    ease: "power2.in",
  })
  .to(secondaryElement, {
    left: "100%",
    opacity: 0,
    duration: 0.6,
    ease: "power2.inOut",
  }, "-=0.2")
  .to(transitionElement, {
    left: "100%",
    duration: 0.6,
    ease: "power2.inOut",
  }, "-=0.4");

  return tl;
};