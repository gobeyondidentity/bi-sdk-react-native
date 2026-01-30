if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/root/.gradle/caches/8.14.3/transforms/564d85eb6d192edf25ad3acfa7aadf6d/transformed/hermes-android-0.81.4-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/root/.gradle/caches/8.14.3/transforms/564d85eb6d192edf25ad3acfa7aadf6d/transformed/hermes-android-0.81.4-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

