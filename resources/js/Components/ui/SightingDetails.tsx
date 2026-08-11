import { SightingDetailsType } from '~/types';
import detail from '~styles/components/ui/sightingDetails.module.scss';

export const SightingDetails = ({ sighting, onClose }: SightingDetailsType) => {
    const formattedDate = new Date(sighting.created_at).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <div className={detail['details-container']}>
            <div className={detail['header']}>
                <h3 className={detail['title']}>
                    {sighting.type === 'person' ? 'Person Sighting' : 'Object Sighting'}
                </h3>
                <button onClick={onClose} className={detail['close-btn']}>✕</button>
            </div>

            <div className={detail['meta']}>
                <span className={detail['tag']}>{sighting.type.toUpperCase()}</span>
                <span className={detail['date']}>{formattedDate}</span>
            </div>

            <div className={detail['section']}>
                <h4>Description</h4>
                <p className={detail['description']}>{sighting.short_description}</p>
            </div>

            <div className={detail['section']}>
                <h4>Details</h4>
                <ul className={detail['details-list']}>
                    {sighting.type === 'person' ? (
                        <>
                            <li><strong>Height:</strong> <span className={detail['capitalize']}>{sighting.details.height}</span></li>
                            <li><strong>Hair Color:</strong> {sighting.details.hair_color}</li>
                            {sighting.details.headwear && <li><strong>Headwear:</strong> {sighting.details.headwear}</li>}
                            {sighting.details.shirt && <li><strong>Shirt/Jacket:</strong> {sighting.details.shirt}</li>}
                            {sighting.details.pants && <li><strong>Pants:</strong> {sighting.details.pants}</li>}
                            {sighting.details.shoes && <li><strong>Shoes:</strong> {sighting.details.shoes}</li>}
                        </>
                    ) : (
                        <>
                            <li><strong>Type:</strong> <span className={detail['capitalize']}>{sighting.details.entity_type}</span></li>
                            <li><strong>General Color:</strong> {sighting.details.general_color}</li>
                            {sighting.details.accent_colors && <li><strong>Accent Colors:</strong> {sighting.details.accent_colors}</li>}
                        </>
                    )}
                </ul>
            </div>

            <div className={detail['footer']}>
                <small>Logged by {sighting.user?.name || 'Unknown User'}</small>
            </div>
        </div>
    );
};