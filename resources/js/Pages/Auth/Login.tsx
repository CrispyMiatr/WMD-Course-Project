import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Layout } from '~/Components';
import styles from '~styles/pages/auth.module.scss';

const Login = ({ status }: { status?: string }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className={styles['auth-container']}>
            <Head title="Log in" />

            <div className={styles['auth-card']}>
                <h2 className={styles['auth-card__title']}>Welcome Back</h2>
                <p className={styles['auth-card__subtitle']}>Log in to report and view sightings.</p>

                {status && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{status}</div>}

                <form onSubmit={submit}>
                    <div className={styles['form-group']}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
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

                    <button type="submit" disabled={processing} className={styles['btn-submit']}>
                        Log in
                    </button>
                </form>

                <div className={styles['auth-links']}>
                    <p>
                        Don't have an account?{' '}
                        <Link href={route('register')}>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

Login.layout = (page: React.ReactNode) => <Layout children={page} hideFooter={true} />;

export default Login;