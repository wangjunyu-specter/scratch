import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import {defineMessages, injectIntl, intlShape} from 'react-intl';

import styles from './my-round-button.css';


const MyRoundButton = ({
    className,
    disabled,
    onClick,
    buttonName
}) => {
    if (disabled) {
        onClick = function () {};
    }
    return (
        <div
            className={classNames(styles.mybutton, className)}
            onClick={onClick}
        >
            <div className={styles.mybuttonContent}>
                {buttonName}
            </div>
        </div>
    );
};
MyRoundButton.defaultProps = {
    onClick: () => {},
    buttonName: '按钮'
};
MyRoundButton.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    buttonName: PropTypes.string
};

export default injectIntl(MyRoundButton);
