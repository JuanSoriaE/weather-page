import './ModalLoading.css';

function ModalLoading() {
  return (
    <div className='modal-overlay'>
      <div className='modal-main'>
        <div className='loading-spinner'></div>
      </div>
    </div>
  );
}

export default ModalLoading;
