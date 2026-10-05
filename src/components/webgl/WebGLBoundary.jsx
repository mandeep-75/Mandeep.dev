import { Component } from 'react';

/**
 * Catches a WebGL subtree that throws while building or on its first frame.
 *
 * A capability probe tells us a context *can* be created. It cannot tell us the
 * scene will survive: shader compilation can fail, a driver can throw on an
 * unsupported blend mode, and a context can be lost between the probe and the
 * first draw. None of those should take the page down with them, because the
 * canvas is decoration and the content above it is the actual site.
 *
 * A class component because `getDerivedStateFromError` has no hook equivalent.
 */
export default class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Kept as console.error, never console.log: this is a real failure a
    // developer needs to see, and it carries the component stack.
    console.error('WebGL backdrop failed, falling back to the CSS stage:', error);
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
