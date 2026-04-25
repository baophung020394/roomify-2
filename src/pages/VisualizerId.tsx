import { useLocation, useParams } from 'react-router';

const VisualizerId = () => {
    const { id } = useParams();
    const location = useLocation();
    const base64 = (location.state as { base64?: string } | null)?.base64;

    return (
        <div>
            <h1>Visualizer</h1>
            <p>Project ID: {id ?? 'Unknown'}</p>
            {
                base64 ? (
                    <img src={base64} alt="Uploaded floor plan preview" />
                ) : (
                    <p>No uploaded image found for this session.</p>
                )
            }
        </div>
    )
}

export default VisualizerId;