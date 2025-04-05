import { useState } from "react";
import axios from "axios";

const STATIC_LOCATIONS = Array.from({ length: 20 }, (_, i) =>
  `IS-1K-${String(i + 1).toString().padStart(3, "0")}`
);

export default function OverviewPage() {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [sendToDatabase, setSendToDatabase] = useState(false);

  const togglePoint = (point: string) => {
    const index = selectedPoints.indexOf(point);
    if (index === -1) {
      setSelectedPoints([...selectedPoints, point]);
    } else {
      const updated = [...selectedPoints];
      updated.splice(index, 1);
      setSelectedPoints(updated);
    }
  };

  const handleSelectAll = () => {
    setSelectedPoints([...STATIC_LOCATIONS]);
  };

  const handleDeselectAll = () => {
    setSelectedPoints([]);
  };

  const handleStartStop = async () => {
    try {
      for (const point of selectedPoints) {
        await axios.post("http://192.168.1.37:8000/add-point", { point });
      }

      const body: any = { points: selectedPoints };
      if (sendToDatabase) {
        body.required_send_database = true;
      }

      await axios.post("http://192.168.1.37:8000/start-operation", body);
      alert("Operation started!");
    } catch (error) {
      console.error("Error starting operation:", error);
      alert("Failed to start operation.");
    }
  };

  const renderButtons = (mode: string) => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {STATIC_LOCATIONS.map((point) => {
          const isSelected = selectedPoints.includes(point);
          const order = selectedPoints.indexOf(point) + 1;
          return (
            <div key={`${mode}-${point}`} style={{ position: 'relative' }}>
              {/* Button */}
              <button
                onClick={() => togglePoint(point)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#1D4ED8', // blue-700
                  color: 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'} // hover
                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#1D4ED8')} // reset hover
              >
                {point}
              </button>

              {/* Order Number Outside the Button */}
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: '#16A34A', // green-600
                  color: 'white',
                  borderRadius: '50%',
                  padding: '4px 8px',
                  fontSize: '12px',
                }}>
                  {order}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '16px' }}>
        <button
          onClick={handleSelectAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#D1D5DB', // gray-300
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#D1D5DB', // gray-300
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Deselect All
        </button>
      </div>
    </>
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
      {/* Dust Measurement Mode */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D4ED8' }}>Dust Measurement Mode</div>
        <button
          onClick={handleStartStop}
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #06B6D4, #14B8A6)',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to bottom right, #0E8D91, #12A692)'} // hover
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to bottom right, #06B6D4, #14B8A6)'} // reset hover
        >
          Start / Stop
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={sendToDatabase}
            onChange={(e) => setSendToDatabase(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Insert data to database
        </label>
        <div style={{ display: 'flex' }}>{renderButtons("dust")}</div>
      </div>

      {/* Transportation Mode */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D4ED8' }}>Transportation Mode</div>
        <button
          onClick={handleStartStop}
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #06B6D4, #14B8A6)',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = 'linear-gradient(to bottom right, #0E8D91, #12A692)')} // hover
          onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = 'linear-gradient(to bottom right, #06B6D4, #14B8A6)')} // reset hover
        >
          Start / Stop
        </button>
        <div style={{ display: 'flex' }}>{renderButtons("transport")}</div>
      </div>
    </div>
  );
}
