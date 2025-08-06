const counterUp = () => {
  class countUp {
    constructor(el) {
      this.el = el;
      this.setVars();
      this.init();
    }

    setVars() {
      this.numberElements = this.el.querySelectorAll("[data-countup-number]");
      this.symbolElements = this.el.querySelectorAll("[data-countup-symbol]");
      this.observerOptions = {
        root: null,
        rootMargin: "0px 0px",
        threshold: 0,
      };
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const isMoney = target.dataset.isMoney === 'true';
            const rawValue = target.dataset.countupNumber;
            
            if (!rawValue) {
              console.warn('Missing data-countup-number value', target);
              return;
            }

            if (isMoney) {
              // Handle money formatting directly
              target.innerHTML = rawValue;
              this.observer.unobserve(target);
            } else {
              try {
                // Safely parse the number after cleaning
                const cleanValue = String(rawValue).replace(/,/g, '').replace(/[^0-9.]/g, '');
                const end = parseFloat(cleanValue) || 0;
                const decimals = this.countDecimals(end);
                this.iterateValue(target, end, decimals);
              } catch (error) {
                console.error('Error processing counter value:', error);
                target.innerHTML = rawValue; // Fallback to original value
              }
            }
          }
        });
      }, this.observerOptions);
    }

    init() {
      if (this.numberElements?.length > 0) {
        this.numberElements.forEach((el) => {
          if (el.dataset.countupNumber) {
            this.observer.observe(el);
          }
        });
      }
      
      if (this.symbolElements?.length > 0) {
        this.symbolElements.forEach((el) => {
          this.observer.observe(el);
        });
      }
    }

    iterateValue(el, end, decimals) {
      const start = 0;
      const duration = 2000;
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsedPercent = (timestamp - startTimestamp) / duration;
        const easedProgress = Math.min(this.easeOutQuint(elapsedPercent), 1);
        let interimNumber = Math.abs(easedProgress * (end - start) + start);
        
        el.innerHTML = this.formatNumber(interimNumber, decimals);
        
        if (easedProgress < 1) {
          window.requestAnimationFrame(step);
        } else {
          this.observer.unobserve(el);
        }
      };

      window.requestAnimationFrame(step);
    }

    easeOutQuint(x) {
      return 1 - Math.pow(1 - x, 5);
    }

    countDecimals(val) {
      if (Math.floor(val) === val) return 0;
      const decimalStr = val.toString().split(".")[1];
      return decimalStr ? decimalStr.length : 0;
    }

    formatNumber(val, decimals) {
      return val.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    }
  }

  // Initialize counters more safely
  const counterContainers = document.querySelectorAll('.counter');
  counterContainers.forEach((container) => {
    if (container && !container.dataset.initialized) {
      try {
        new countUp(container);
        container.dataset.initialized = true;
      } catch (error) {
        console.error('Failed to initialize counter:', error);
      }
    }
  });
};

export default counterUp;