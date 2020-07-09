import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';
import styles from './arrow-btn.css';
import leftIcon from './left-arrow.svg';
import rightIcon from './right-arrow.svg';


const ToggleArrowBtn = ({
    type,
    onClick,
    disabled
}) => (
    <div>
        {
            type === 1 ? (
                <Button
                    className={classNames(
                        styles.toggleArrowBtn,
                        styles.btnLeft
                    )}
                    disabled={disabled}
                    onClick={onClick}
                >
                    <img
                        className={classNames(
                            styles.arrowImg
                        )}
                        draggable={false}
                        src={leftIcon}
                    />
                </Button>
            ) : (
                <Button
                    className={classNames(
                        styles.toggleArrowBtn,
                        styles.btnRight
                    )}
                    disabled={disabled}
                    onClick={onClick}
                >
                    <img
                        className={classNames(
                            styles.arrowImg
                        )}
                        draggable={false}
                        src={rightIcon}
                    />
                </Button>
            )
        }
            
    </div>
);
ToggleArrowBtn.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.number,
    disabled: PropTypes.bool
};
ToggleArrowBtn.defaultProps = {
    onClick: () => {}
};
export default ToggleArrowBtn;
