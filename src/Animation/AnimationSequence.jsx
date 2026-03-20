import React from "react";
import PropTypes from "prop-types";
import AnimatedElement from "./AnimatedElement";

const AnimationSequence = ({
  children,
  direction = "up",
  baseDelay = 300,
  staggerDelay = 200,
  duration = 700,
  distance = 12,
  easing = "ease-out",
  className = "",
  triggerOnce = true,
}) => {
  const animatedChildren = React.Children.map(children, (child, index) => {
    const delay = baseDelay + index * staggerDelay;
    
    if (child.type === AnimatedElement) {
      return React.cloneElement(child, {
        delay: child.props.delay !== undefined ? child.props.delay : delay,
        direction: child.props.direction || direction,
        duration: child.props.duration || duration,
        distance: child.props.distance || distance,
        easing: child.props.easing || easing,
        triggerOnce,
      });
    }
    
    return (
      <AnimatedElement
        key={index}
        direction={direction}
        delay={delay}
        duration={duration}
        distance={distance}
        easing={easing}
        triggerOnce={triggerOnce}
      >
        {child}
      </AnimatedElement>
    );
  });

  return <div className={className}>{animatedChildren}</div>;
};

AnimationSequence.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf([
    "up", "down", "left", "right", 
    "up-left", "up-right", "down-left", "down-right"
  ]),
  baseDelay: PropTypes.number,
  staggerDelay: PropTypes.number,
  duration: PropTypes.number,
  distance: PropTypes.number,
  easing: PropTypes.string,
  className: PropTypes.string,
  triggerOnce: PropTypes.bool,
};

export default AnimationSequence;