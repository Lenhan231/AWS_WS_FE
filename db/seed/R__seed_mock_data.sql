DO $$
DECLARE
    v_admin_user_id BIGINT;
    v_iter INT;
    v_created_at TIMESTAMPTZ;
    v_gym_location_id BIGINT;
    v_gym_id BIGINT;
    v_gym_staff_user_id BIGINT;
    v_pt_location_id BIGINT;
    v_pt_user_account_id BIGINT;
    v_pt_profile_id BIGINT;
    v_association_status VARCHAR(32);
    v_client_location_id BIGINT;
    v_client_user_account_id BIGINT;
    v_offer_id BIGINT;
BEGIN
    SELECT id INTO v_admin_user_id
    FROM users
    WHERE email = 'admin@easybody.com';

    IF v_admin_user_id IS NULL THEN
        RAISE NOTICE 'Seed mock data skipped because admin user not found.';
        RETURN;
    END IF;

    FOR v_iter IN 1..15 LOOP
        v_created_at := NOW() - (v_iter || ' days')::INTERVAL;

        INSERT INTO locations (
            latitude,
            longitude,
            coordinates,
            formatted_address,
            created_at,
            updated_at
        )
        VALUES (
            10.700000 + (v_iter * 0.01),
            106.700000 + (v_iter * 0.01),
            ST_SetSRID(ST_MakePoint(106.700000 + (v_iter * 0.01), 10.700000 + (v_iter * 0.01)), 4326),
            FORMAT('Mock Gym Address #%s, District %s, Hồ Chí Minh', v_iter, ((v_iter - 1) % 10) + 1),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_gym_location_id;

        INSERT INTO gyms (
            name,
            description,
            logo_url,
            address,
            city,
            state,
            country,
            postal_code,
            phone_number,
            email,
            website,
            location_id,
            active,
            verified,
            created_at,
            updated_at
        )
        VALUES (
            FORMAT('Mock Gym #%s', v_iter),
            'Strength, conditioning và recovery zones cho mock data.',
            FORMAT('https://picsum.photos/seed/mock-gym-%s/480/320', v_iter),
            FORMAT('%s Mock Street', 10 + v_iter),
            'TP. Hồ Chí Minh',
            'Hồ Chí Minh',
            'Việt Nam',
            FORMAT('70%03s', v_iter),
            FORMAT('+8488800%04s', 1000 + v_iter),
            FORMAT('mock.gym%s@easybody.vn', v_iter),
            FORMAT('https://gym%s.easybody.vn', v_iter),
            v_gym_location_id,
            TRUE,
            (v_iter % 3 <> 0),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_gym_id;

        INSERT INTO users (
            cognito_sub,
            email,
            first_name,
            last_name,
            phone_number,
            role,
            active,
            profile_image_url,
            created_at,
            updated_at
        )
        VALUES (
            FORMAT('mock-gymstaff-sub-%s', v_iter),
            FORMAT('mock.staff%s@easybody.com', v_iter),
            FORMAT('Staff%s', v_iter),
            'Nguyen',
            FORMAT('+8488811%04s', 2000 + v_iter),
            'GYM_STAFF',
            TRUE,
            FORMAT('https://picsum.photos/seed/mock-gymstaff-%s/200', v_iter),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_gym_staff_user_id;

        INSERT INTO gym_staff (
            user_id,
            gym_id,
            position,
            can_manage_offers,
            can_manage_pts,
            active,
            created_at,
            updated_at
        ) VALUES (
            v_gym_staff_user_id,
            v_gym_id,
            FORMAT('Manager #%s', v_iter),
            (v_iter % 2 = 0),
            (v_iter % 3 = 0),
            TRUE,
            v_created_at,
            v_created_at
        );

        INSERT INTO locations (
            latitude,
            longitude,
            coordinates,
            formatted_address,
            created_at,
            updated_at
        )
        VALUES (
            10.710000 + (v_iter * 0.01),
            106.710000 + (v_iter * 0.01),
            ST_SetSRID(ST_MakePoint(106.710000 + (v_iter * 0.01), 10.710000 + (v_iter * 0.01)), 4326),
            FORMAT('Mock PT Address #%s, Bình Thạnh, Hồ Chí Minh', v_iter),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_pt_location_id;

        INSERT INTO users (
            cognito_sub,
            email,
            first_name,
            last_name,
            phone_number,
            role,
            active,
            profile_image_url,
            created_at,
            updated_at
        )
        VALUES (
            FORMAT('mock-pt-sub-%s', v_iter),
            FORMAT('mock.pt%s@easybody.com', v_iter),
            FORMAT('Trainer%s', v_iter),
            'Pham',
            FORMAT('+8488822%04s', 3000 + v_iter),
            'PT_USER',
            TRUE,
            FORMAT('https://picsum.photos/seed/mock-pt-%s/200', v_iter),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_pt_user_account_id;

        INSERT INTO pt_users (
            user_id,
            bio,
            specializations,
            certifications,
            years_of_experience,
            profile_image_url,
            location_id,
            active,
            verified,
            created_at,
            updated_at
        )
        VALUES (
            v_pt_user_account_id,
            'Mock PT cung cấp chương trình cá nhân hoá hybrid.',
            'Strength, Conditioning, Mobility',
            'NASM CPT, Mock Nutrition',
            3 + (v_iter % 7),
            FORMAT('https://picsum.photos/seed/mock-pt-profile-%s/320/320', v_iter),
            v_pt_location_id,
            TRUE,
            (v_iter % 4 <> 0),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_pt_profile_id;

        v_association_status := CASE
            WHEN v_iter % 3 = 0 THEN 'REJECTED'
            WHEN v_iter % 3 = 1 THEN 'APPROVED'
            ELSE 'PENDING'
        END;

        INSERT INTO gym_pt_associations (
            gym_id,
            pt_user_id,
            approval_status,
            rejection_reason,
            approved_by_user_id,
            approved_at,
            created_at,
            updated_at
        ) VALUES (
            v_gym_id,
            v_pt_profile_id,
            v_association_status,
            CASE WHEN v_association_status = 'REJECTED' THEN 'Mock rejection reason' ELSE NULL END,
            CASE WHEN v_association_status = 'APPROVED' THEN v_gym_staff_user_id ELSE NULL END,
            CASE WHEN v_association_status = 'APPROVED' THEN v_created_at ELSE NULL END,
            v_created_at,
            v_created_at
        );

        INSERT INTO locations (
            latitude,
            longitude,
            coordinates,
            formatted_address,
            created_at,
            updated_at
        )
        VALUES (
            10.720000 + (v_iter * 0.01),
            106.720000 + (v_iter * 0.01),
            ST_SetSRID(ST_MakePoint(106.720000 + (v_iter * 0.01), 10.720000 + (v_iter * 0.01)), 4326),
            FORMAT('Mock Client Address #%s, Thủ Đức, Hồ Chí Minh', v_iter),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_client_location_id;

        INSERT INTO users (
            cognito_sub,
            email,
            first_name,
            last_name,
            phone_number,
            role,
            active,
            profile_image_url,
            created_at,
            updated_at
        )
        VALUES (
            FORMAT('mock-client-sub-%s', v_iter),
            FORMAT('mock.client%s@easybody.com', v_iter),
            FORMAT('Client%s', v_iter),
            'Le',
            FORMAT('+8488833%04s', 4000 + v_iter),
            'CLIENT_USER',
            TRUE,
            FORMAT('https://picsum.photos/seed/mock-client-%s/200', v_iter),
            v_created_at,
            v_created_at
        )
        RETURNING id INTO v_client_user_account_id;

        INSERT INTO client_users (
            user_id,
            location_id,
            fitness_goals,
            preferred_activities,
            created_at,
            updated_at
        )
        VALUES (
            v_client_user_account_id,
            v_client_location_id,
            FORMAT('Goal set #%s: Gain lean muscle, improve endurance.', v_iter),
            'Functional training, HIIT, Yoga',
            v_created_at,
            v_created_at
        );

        IF v_iter % 2 = 0 THEN
            INSERT INTO offers (
                title,
                description,
                offer_type,
                gym_id,
                pt_user_id,
                price,
                currency,
                duration_description,
                image_urls,
                status,
                risk_score,
                rejection_reason,
                moderated_by_user_id,
                moderated_at,
                average_rating,
                rating_count,
                active,
                created_at,
                updated_at
            )
            VALUES (
                FORMAT('Mock Gym Offer #%s', v_iter),
                'Unlimited access to mock facilities with recovery support.',
                'GYM_OFFER',
                v_gym_id,
                NULL,
                800000 + (v_iter * 10000),
                'VND',
                FORMAT('%s-day pass', 10 + v_iter),
                FORMAT('["https://picsum.photos/seed/mock-gym-offer-%s/640/360"]', v_iter),
                'APPROVED',
                0,
                NULL,
                v_gym_staff_user_id,
                v_created_at,
                0,
                0,
                TRUE,
                v_created_at,
                v_created_at
            )
            RETURNING id INTO v_offer_id;
        ELSE
            INSERT INTO offers (
                title,
                description,
                offer_type,
                gym_id,
                pt_user_id,
                price,
                currency,
                duration_description,
                image_urls,
                status,
                risk_score,
                rejection_reason,
                moderated_by_user_id,
                moderated_at,
                average_rating,
                rating_count,
                active,
                created_at,
                updated_at
            )
            VALUES (
                FORMAT('Mock PT Offer #%s', v_iter),
                'One-on-one coaching block focused on compound lifts and mobility.',
                'PT_OFFER',
                NULL,
                v_pt_profile_id,
                1500000 + (v_iter * 20000),
                'VND',
                FORMAT('%s personal sessions', 5 + (v_iter % 6)),
                FORMAT('["https://picsum.photos/seed/mock-pt-offer-%s/640/360"]', v_iter),
                'APPROVED',
                0,
                NULL,
                v_gym_staff_user_id,
                v_created_at,
                0,
                0,
                TRUE,
                v_created_at,
                v_created_at
            )
            RETURNING id INTO v_offer_id;
        END IF;

        INSERT INTO ratings (
            offer_id,
            client_user_id,
            rating,
            comment,
            created_at,
            updated_at
        )
        VALUES (
            v_offer_id,
            v_client_user_account_id,
            ((v_iter - 1) % 5) + 1,
            FORMAT('Mock feedback #%s - enjoyable sessions!', v_iter),
            v_created_at,
            v_created_at
        )
        ON CONFLICT (offer_id, client_user_id) DO NOTHING;

        INSERT INTO reports (
            reported_by_user_id,
            offer_id,
            reported_user_id,
            reason,
            details,
            status,
            reviewed_by_user_id,
            reviewed_at,
            review_notes,
            created_at,
            updated_at
        )
        VALUES (
            v_client_user_account_id,
            v_offer_id,
            CASE WHEN v_iter % 2 = 0 THEN v_pt_user_account_id ELSE v_gym_staff_user_id END,
            FORMAT('Mock report reason #%s', v_iter),
            'Auto-generated mock report for QA scenarios.',
            CASE WHEN v_iter % 4 = 0 THEN 'RESOLVED' ELSE 'PENDING' END,
            CASE WHEN v_iter % 4 = 0 THEN v_admin_user_id ELSE NULL END,
            CASE WHEN v_iter % 4 = 0 THEN v_created_at + INTERVAL '6 hours' ELSE NULL END,
            CASE WHEN v_iter % 4 = 0 THEN 'Mock moderation note resolved.' ELSE NULL END,
            v_created_at,
            v_created_at
        );
    END LOOP;
END
$$;
