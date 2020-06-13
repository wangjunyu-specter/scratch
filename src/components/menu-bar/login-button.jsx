import PropTypes from 'prop-types';
import React from 'react';

import styles from './login-button.css';

const LoginButton = ({
    disabled,
    onClick,
    children,
    ...props
}) => {

    if (disabled) {
        onClick = function () {};
    }


    return (
        <button
            className={styles.loginButton}
            role="button"
            onClick={onClick}
            {...props}
        >
            <span className={styles.content}>{children}</span>
        </button>
    );
};

LoginButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    onClick: PropTypes.func
};

export default LoginButton;
