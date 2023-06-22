import React, { PureComponent } from 'react';

class ContentEditableTag extends PureComponent {
    render = () => {
        const { content, className = '', placeholder = 'Vui lòng nhập trường này' } = this.props;

        let eventProps = {};
        for (let key in this.props) {
            const a = key?.startsWith?.('on');
            if (a) {
                const event = key.substring(0, 2) + key.charAt(2).toUpperCase() + key.substring(2 + 1);
                eventProps[event] = this.props[key];
            }
        }
        console.log(eventProps);
        return (
            <div
                {...eventProps}
                className={`${className}`}
                style={{ padding: '0.1em 0.4em' }}
                ref={this.props.forwardRef}
                contentEditable
                suppressContentEditableWarning
                placeholder={placeholder}
                spellCheck="false"
                tabIndex="0"
                onMouseEnter={(e) => e.target.focus()}
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
        );
    };
}

export default React.forwardRef((props, ref) => <ContentEditableTag {...props} forwardRef={ref} />);
