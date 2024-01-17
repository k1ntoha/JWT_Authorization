import { FC } from "react";
import styles from "./Loader.module.sass";

const Button: FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.circle}></div>
    </div>
  );
};

export default Button;
