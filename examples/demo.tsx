import React, { useState } from 'react';
import { InteractiveVideo, InteractiveVideoConfig } from '../src/react';

const sampleConfig: InteractiveVideoConfig = {
  questions: [
    {
      id: 'q1',
      triggerTime: 10,
      question: 'Video 10 saniyede durup bu soruyu soruyor. Doğru cevap nedir?',
      options: [
        { id: 'a1', text: 'Bu doğru cevap', isCorrect: true },
        { id: 'a2', text: 'Bu yanlış cevap', isCorrect: false },
        { id: 'a3', text: 'Bu da yanlış', isCorrect: false }
      ],
      rewindTime: 5
    },
    {
      id: 'q2',
      triggerTime: 25,
      question: 'Video 25 saniyede durup ikinci soruyu soruyor. Hangi seçenek doğru?',
      options: [
        { id: 'b1', text: 'Birinci seçenek', isCorrect: false },
        { id: 'b2', text: 'İkinci seçenek (DOĞRU)', isCorrect: true },
        { id: 'b3', text: 'Üçüncü seçenek', isCorrect: false },
        { id: 'b4', text: 'Dördüncü seçenek', isCorrect: false }
      ],
      rewindTime: 15
    },
    {
      id: 'q3',
      triggerTime: 40,
      question: 'Son soru: Video 40 saniyede duruyor. Test tamamlanmak üzere!',
      options: [
        { id: 'c1', text: 'Yanlış cevap', isCorrect: false },
        { id: 'c2', text: 'Doğru cevap ✓', isCorrect: true }
      ],
      rewindTime: 30
    }
  ]
};

export const Demo: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  const handleQuestionAnswered = (questionId: string, selectedOptionId: string, isCorrect: boolean) => {
    const message = `Soru ${questionId}: ${selectedOptionId} seçeneği ${isCorrect ? 'DOĞRU' : 'YANLIŞ'}`;
    setLog(prev => [...prev, message]);
    console.log(message);
  };

  const handleVideoEnd = () => {
    setLog(prev => [...prev, 'Video tamamlandı! 🎉']);
    console.log('Video ended');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>@parevo/interactive-video Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Videosu</h2>
        <p>Bu demo aşağıdaki zamanlarda sorular gösterecek:</p>
        <ul>
          <li><strong>10 saniye:</strong> İlk soru (yanlış cevap verirseniz 5. saniyeye geri saracak)</li>
          <li><strong>25 saniye:</strong> İkinci soru (yanlış cevap verirseniz 15. saniyeye geri saracak)</li>
          <li><strong>40 saniye:</strong> Üçüncü soru (yanlış cevap verirseniz 30. saniyeye geri saracak)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <InteractiveVideo
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          config={sampleConfig}
          width={800}
          height={450}
          controls={true}
          onQuestionAnswered={handleQuestionAnswered}
          onVideoEnd={handleVideoEnd}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Event Log:</h3>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          minHeight: '100px',
          fontFamily: 'monospace'
        }}>
          {log.length === 0 ? (
            <em>Henüz olay yok... Video oynatın ve soruları cevaplayın!</em>
          ) : (
            log.map((entry, index) => (
              <div key={index} style={{ margin: '5px 0' }}>
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4f8', borderRadius: '5px' }}>
        <h3>Nasıl Test Edilir:</h3>
        <ol>
          <li>Video oynatmaya başlayın</li>
          <li>10. saniyede video duracak ve ilk soru çıkacak</li>
          <li>Yanlış cevap verirseniz video 5. saniyeye geri saracak</li>
          <li>Doğru cevap verirseniz video devam edecek</li>
          <li>25. ve 40. saniyede aynı işlem tekrarlanacak</li>
          <li>Her olay aşağıdaki logda görünecek</li>
        </ol>
      </div>
    </div>
  );
};

export default Demo;