package com.cadev.backend.dto.sortie;

import com.cadev.backend.enumeration.RoleMentorat;

import java.util.List;

public record MentoratDetailDto(MentoratDto mentorat, RoleMentorat monRole, List<SeanceDto> seances,
                                String bilanMentor, String bilanMentore) {
}
