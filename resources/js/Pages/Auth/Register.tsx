import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Layout } from '~/Components';
import styles from '~styles/pages/auth.module.scss';

const Register = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className={styles['auth-container']}>
            <Head title="Register" />

            <div className={styles['auth-card']}>
                <h2 className={styles['auth-card__title']}>Join WatchLog</h2>
                <p className={styles['auth-card__subtitle']}>Help keep the neighborhood safe.</p>

                <form onSubmit={submit}>
                    <div className={styles['form-group']}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                        {errors.name && <span className={styles['error']}>{errors.name}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label>Username (Optional)</label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="How others will see you"
                        />
                        {errors.username && <span className={styles['error']}>{errors.username}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <span className={styles['error']}>{errors.email}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <span className={styles['error']}>{errors.password}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <span className={styles['error']}>{errors.password_confirmation}</span>}
                    </div>

                    <button type="submit" disabled={processing} className={styles['btn-submit']}>
                        Register
                    </button>
                </form>

                <div className={styles['auth-links']}>
                    <p>
                        Already have an account?{' '}
                        <Link href={route('login')}>Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

Register.layout = (page: React.ReactNode) => <Layout children={page} hideFooter={true} />;

export default Register;