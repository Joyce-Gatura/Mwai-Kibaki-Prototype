(function () {

    // ── Scoring functions (Older Child TEWS 3–12 years) ──────────────────────

    function scoreMobility(v) {
        if (v === 'Normal') return 0;
        if (v === 'Unable') return 2;
        return null;
    }

    function scoreRespRate(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 15)  return 3;
        if (v <= 16) return 2;
        if (v <= 21) return 0;
        if (v <= 26) return 1;
        return 2;          // ← was missing: covers 27+
    }

    function scorePulse(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 60)   return 3;
        if (v <= 79)  return 2;
        if (v <= 99)  return 0;
        if (v <= 129) return 1;
        return 2;          // ← was missing: covers 130+
    }

    function scoreTemp(v) {
        if (v === '' || isNaN(v)) return null;
        v = parseFloat(v);
        if (v < 35)    return 2;
        if (v <= 38.4) return 0;
        return 2;
    }

    function scoreAVPU(v) {
        if (v === 'Alert')          return 0;
        if (v === 'Confused')       return 2;
        if (v === 'React to voice') return 1;
        if (v === 'React to pain')  return 2;
        if (v === 'Unresponsive')   return 3;
        return null;
    }

    function scoreTrauma(v) {
        if (v === '0') return 0;
        if (v === '1') return 1;
        return null;
    }

    // ── Helper: write score to readonly field ─────────────────────────────────

    function setScore(fieldId, score) {
        const el = document.getElementById(fieldId);
        if (!el) return;
        el.value = score !== null ? score : '';
    }

    // ── Recalculate all scores and total ──────────────────────────────────────

    function recalculate() {
        const scores = {
            mobility: scoreMobility(document.getElementById('ochildMobility')?.value),
            respRate: scoreRespRate(document.getElementById('ochildRespRate')?.value),
            pulse:    scorePulse(document.getElementById('ochildPulseRate')?.value),
            temp:     scoreTemp(document.getElementById('ochildTewsTemp')?.value),
            avpu:     scoreAVPU(document.getElementById('ochildAVPU')?.value),
            trauma:   scoreTrauma(document.getElementById('ochildTrauma')?.value),
        };

        setScore('ochildMobilityScore', scores.mobility);
        setScore('ochildRespScore',     scores.respRate);
        setScore('ochildPulseScore',    scores.pulse);
        setScore('ochildTempScore',     scores.temp);
        setScore('ochildAVPUScore',     scores.avpu);
        setScore('ochildTraumaScore',   scores.trauma);

        const values = Object.values(scores).filter(s => s !== null);
        const total  = values.reduce((sum, s) => sum + s, 0);

        setScore('ochildTotalTews', values.length ? total : null);
    }

    // ── Pain score: auto-select radio from face value ─────────────────────────

    function autoSelectPainScore(faceValue) {
        const v = parseInt(faceValue, 10);

        let target = null;
        if (v >= 0 && v <= 3)  target = 'Mild';
        if (v >= 4 && v <= 6)  target = 'Moderate';
        if (v >= 7 && v <= 10) target = 'Severe';

        if (!target) return;

        document.querySelectorAll('#older-child-form input[type="radio"][name="PainScore"]')
            .forEach(radio => {
                radio.checked = (radio.value === target);
            });

        document.querySelectorAll('#older-child-form .pain-score-option').forEach(opt => {
            opt.classList.toggle('active', opt.querySelector('input')?.value === target);
        });
    }

    // ── Face pain scale buttons ───────────────────────────────────────────────

    function attachFaceButtons() {
        document.querySelectorAll('#ochildFacesScale .face-btn').forEach(btn => {
            btn.addEventListener('click', function () {

                // 1. Highlight selected face
                document.querySelectorAll('#ochildFacesScale .face-btn')
                        .forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');

                // 2. Store in hidden field
                const hidden = document.getElementById('ochildFacePainScore');
                if (hidden) hidden.value = this.dataset.value;

                // 3. Auto-select pain score radio
                autoSelectPainScore(this.dataset.value);
            });
        });
    }

    // ── Attach TEWS input listeners ───────────────────────────────────────────

    function attachListeners() {
        const targets = [
            'ochildMobility', 'ochildRespRate', 'ochildPulseRate',
            'ochildTewsTemp', 'ochildAVPU', 'ochildTrauma'
        ];

        targets.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', recalculate);
            } else {
                console.warn(`olderChildTews.js: element #${id} not found.`);
            }
        });
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    function init() {
        attachListeners();
        attachFaceButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();