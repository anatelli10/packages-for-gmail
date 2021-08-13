/**
 * The "Loading..." overlay element, copycat of element in Gmail
 */
const createLoadingElement = id => {
    const element = document.createElement('div');
    element.id = 'packages-loading';
    element.style.display = 'none';
    element.style.position = 'absolute';
    element.style.left = '0';
    element.style.right = '0';
    element.style.margin = 'auto';
    element.style.width = 'fit-content';
    element.style.zIndex = '10';
    element.style.fontFamily =
        'Roboto, RobotoDraft, Helvetica, Arial, sans-serif';
    element.style.fontSize = '0.875rem';
    element.style.fontWeight = 'bold';
    element.style.whiteSpace = 'nowrap';
    element.style.textAlign = 'center';
    element.style.backgroundColor = '#f9edbe';
    element.style.border = '1px solid #f0c36d';
    element.style.borderRadius = ' 0 0 2px 2px';
    element.style.boxShadow = '0 2px 4px rgb(0 0 0 / 20%)';
    element.style.color = '#222';
    element.style.padding = '6px 10px';
    element.innerHTML = '<span style="padding-left: 2px">Loading...</span>';
    document.body.appendChild(element);
    return element;
};

export default createLoadingElement;
