import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { SightingFormType, SightingType } from '~/types';
import form from '~styles/components/ui/sightingForm.module.scss';

export const SightingForm = ({ lat, lng, recentTracks, onSuccess }: SightingFormType) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        latitude: lat,
        longitude: lng,
        type: 'person' as 'person' | 'other',
        short_description: '',
        details: {
            hair_color: '', headwear: '', shirt: '', pants: '', shoes: '', height: '',
            entity_type: 'car', general_color: '', accent_colors: ''
        } as any,
        track_id: '',
    });

    // Update form state if map pin moves
    useEffect(() => {
        setData(data => ({ ...data, latitude: lat, longitude: lng }));
    }, [lat, lng]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sightings.store'), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    const handleDetailChange = (key: string, value: string) => {
        setData('details', { ...data.details, [key]: value });
    };

    const handleTrackSelect = (track: SightingType) => {
        // Looks for "Sighting #[number]: " at start
        const match = track.short_description.match(/^Sighting #(\d+): /);
        const cleanDescription = track.short_description.replace(/^Sighting #(\d+): /, '');

        // Increment number if found, otherwise start at 2
        const nextCount = match ? parseInt(match[1]) + 1 : 2;

        setData(d => ({
            ...d,
            track_id: track.track_id || '',
            type: track.type,
            details: { ...track.details },
            short_description: `Sighting #${nextCount}: ${cleanDescription}`
        }));
    };

    return (
        <form onSubmit={submit} className={form['form']}>
            <h3 className={form['form__title']}>Log a Sighting</h3>

            <div className={form['form__group']}>
                <label>Is this a continuation of an existing sighting?</label>
                <div className={form['flex-row']}>
                    <select
                        style={{ flex: 1 }}
                        value={data.track_id}
                        onChange={(e) => {
                            const track = recentTracks.find(t => t.track_id === e.target.value);
                            if (track) handleTrackSelect(track);
                        }}
                    >
                        <option value="">-- No, this is a new subject --</option>
                        {recentTracks.map(t => (
                            <option key={t.id} value={t.track_id!}>
                                {t.type.toUpperCase()}: {t.short_description} ({t.location_name})
                            </option>
                        ))}
                    </select>
                    {data.track_id && (
                        <button
                            type="button"
                            onClick={() => setData('track_id', '')}
                            className={form['btn-secondary']}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <hr style={{ margin: '0.25rem 0', border: '0', borderTop: '1px solid #eee' }} />

            <div className={form['form__group']}>
                <label>Type of Sighting</label>
                <select value={data.type} onChange={e => setData('type', e.target.value as 'person' | 'other')}>
                    <option value="person">Person</option>
                    <option value="other">Other (Car, Drone, Dog, etc.)</option>
                </select>
            </div>

            <div className={form['form__group']}>
                <label>Short Description *</label>
                <textarea
                    value={data.short_description}
                    onChange={e => setData('short_description', e.target.value)}
                    required
                />
                {errors.short_description && <span className={form['error']}>{errors.short_description}</span>}
            </div>

            {data.type === 'person' ? (
                <>
                    <div className={form['form__group']}>
                        <label>Height *</label>
                        <select value={data.details.height} onChange={e => handleDetailChange('height', e.target.value)} required>
                            <option value="" disabled>Select height</option>
                            <option value="short">Short</option>
                            <option value="middle">Middle</option>
                            <option value="tall">Tall</option>
                        </select>
                    </div>
                    <div className={form['form__group']}>
                        <label>Hair Color *</label>
                        <input type="text" value={data.details.hair_color} onChange={e => handleDetailChange('hair_color', e.target.value)} required />
                    </div>
                    <div className={form['form__group']}>
                        <label>Headwear</label>
                        <input type="text" value={data.details.headwear} onChange={e => handleDetailChange('headwear', e.target.value)} />
                    </div>
                    <div className={form['form__group']}>
                        <label>Shirt/Jacket</label>
                        <input type="text" value={data.details.shirt} onChange={e => handleDetailChange('shirt', e.target.value)} />
                    </div>
                    <div className={form['form__group']}>
                        <label>Pants</label>
                        <input type="text" value={data.details.pants} onChange={e => handleDetailChange('pants', e.target.value)} />
                    </div>
                </>
            ) : (
                <>
                    <div className={form['form__group']}>
                        <label>Type (Car, Drone, etc.) *</label>
                        <input type="text" value={data.details.entity_type} onChange={e => handleDetailChange('entity_type', e.target.value)} required />
                    </div>
                    <div className={form['form__group']}>
                        <label>General Color *</label>
                        <input type="text" value={data.details.general_color} onChange={e => handleDetailChange('general_color', e.target.value)} required />
                    </div>
                    <div className={form['form__group']}>
                        <label>Accent Colors</label>
                        <input type="text" value={data.details.accent_colors} onChange={e => handleDetailChange('accent_colors', e.target.value)} />
                    </div>
                </>
            )}

            <button type="submit" disabled={processing} className={form['btn-submit']}>
                {processing ? 'Saving...' : 'Save Log'}
            </button>
        </form>
    );
};