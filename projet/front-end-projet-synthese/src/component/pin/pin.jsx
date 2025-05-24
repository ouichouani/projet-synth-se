import styles from '../../css/pin/pin.module.css';

const Pin = function({image_path, path}) {

    return (
      <div class={styles.img_container}>
        <a href={path}>
          <img src={image_path} />
        </a>
      </div>
    );
}

export default Pin;