import styles from '~styles/components/ui/searchbar.module.scss';

export const Searchbar = () => {

    return (
        <div className={styles['search-container']}>
            <input
                type="text"
            />

            <div className={styles['dropdown']}>
                <div className={styles['dropdown__section']}>

                </div>

                <div className={styles['dropdown__section']}>

                </div>
            </div>
        </div>
    );
};